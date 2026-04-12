package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"seat-query/backend/internal/models"
)

type AttendeeRepository struct {
	db *sql.DB
}

func NewAttendeeRepository(db *sql.DB) *AttendeeRepository {
	return &AttendeeRepository{db: db}
}

func (r *AttendeeRepository) SearchByName(ctx context.Context, name string) ([]models.Attendee, error) {
	query := `
		SELECT
			name,
			organization,
			zone,
			row,
			seat
		FROM attendees
		WHERE name ILIKE $1
		ORDER BY name ASC, organization ASC, zone ASC, row ASC, seat ASC
	`

	rows, err := r.db.QueryContext(ctx, query, "%"+strings.TrimSpace(name)+"%")
	if err != nil {
		return nil, fmt.Errorf("query attendees: %w", err)
	}
	defer rows.Close()

	attendees := make([]models.Attendee, 0)
	for rows.Next() {
		var attendee models.Attendee
		if err := rows.Scan(
			&attendee.Name,
			&attendee.Organization,
			&attendee.Zone,
			&attendee.Row,
			&attendee.Seat,
		); err != nil {
			return nil, fmt.Errorf("scan attendee: %w", err)
		}

		attendee.DisplayName = fmt.Sprintf("%s(%s)", attendee.Name, attendee.Organization)
		attendees = append(attendees, attendee)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate attendees: %w", err)
	}

	return attendees, nil
}
