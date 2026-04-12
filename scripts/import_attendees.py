from __future__ import annotations

import argparse
import os
from dataclasses import dataclass

import pandas as pd
from sqlalchemy import create_engine, text


@dataclass(frozen=True)
class Settings:
    file_path: str
    database_url: str
    truncate_before_load: bool


def parse_args() -> Settings:
    parser = argparse.ArgumentParser(description="Import attendee seats from an xlsx file.")
    parser.add_argument("--file", dest="file_path", required=True, help="Path to the source .xlsx file")
    parser.add_argument(
        "--database-url",
        dest="database_url",
        default=os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg://seat_query:seat_query@localhost:5432/seat_query",
        ),
        help="SQLAlchemy database URL. Defaults to DATABASE_URL environment variable.",
    )
    parser.add_argument(
        "--truncate",
        action="store_true",
        help="Truncate attendees before loading new records.",
    )
    args = parser.parse_args()

    return Settings(
        file_path=args.file_path,
        database_url=args.database_url,
        truncate_before_load=args.truncate,
    )


def load_excel(file_path: str) -> pd.DataFrame:
    if not file_path.lower().endswith(".xlsx"):
        raise ValueError("input file must be .xlsx")

    dataframe = pd.read_excel(file_path, dtype={"name": "string", "organization": "string", "zone": "string"})
    expected_columns = {"name", "organization", "zone", "row", "seat"}
    missing_columns = expected_columns.difference(dataframe.columns)
    if missing_columns:
        raise ValueError(f"missing required columns: {', '.join(sorted(missing_columns))}")

    return dataframe[list(expected_columns)]


def clean_dataframe(dataframe: pd.DataFrame) -> pd.DataFrame:
    cleaned = dataframe.copy()

    for column in ["name", "organization", "zone"]:
        cleaned[column] = cleaned[column].astype("string").str.strip()

    cleaned = cleaned.dropna(subset=["name", "organization", "zone", "row", "seat"])
    cleaned = cleaned[(cleaned["organization"] != "") & (cleaned["name"] != "") & (cleaned["zone"] != "")]

    cleaned["row"] = pd.to_numeric(cleaned["row"], errors="raise").astype(int)
    cleaned["seat"] = pd.to_numeric(cleaned["seat"], errors="raise").astype(int)

    cleaned = cleaned.drop_duplicates(subset=["name", "organization", "zone", "row", "seat"], keep="first")
    cleaned = cleaned.sort_values(by=["name", "organization", "zone", "row", "seat"]).reset_index(drop=True)

    return cleaned


def write_to_database(dataframe: pd.DataFrame, settings: Settings) -> None:
    engine = create_engine(settings.database_url, future=True)

    with engine.begin() as connection:
        if settings.truncate_before_load:
            connection.execute(text("TRUNCATE TABLE attendees RESTART IDENTITY"))

        dataframe.to_sql("attendees", con=connection, if_exists="append", index=False, method="multi")


def main() -> None:
    settings = parse_args()
    dataframe = load_excel(settings.file_path)
    cleaned = clean_dataframe(dataframe)
    write_to_database(cleaned, settings)
    print(f"Imported {len(cleaned)} attendee rows into PostgreSQL.")


if __name__ == "__main__":
    main()
