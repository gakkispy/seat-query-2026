CREATE TABLE IF NOT EXISTS attendees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    row INT NOT NULL,
    seat INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_name ON attendees(name);
CREATE INDEX IF NOT EXISTS idx_name_org ON attendees(name, organization);

INSERT INTO attendees (name, organization, zone, row, seat) VALUES
('靳晓萌', '成都', 'C', 1, 10),
('钟威', '成都', 'A', 1, 9),
('王常宇', '成都', 'B', 1, 8),
('学佳', '成都', 'B', 1, 7),
('伊桑·布朗', '国际', 'C', 1, 6);
