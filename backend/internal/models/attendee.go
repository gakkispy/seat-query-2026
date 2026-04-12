package models

type Attendee struct {
	Name         string `json:"name"`
	Organization string `json:"organization"`
	DisplayName  string `json:"display_name"`
	Zone         string `json:"zone"`
	Row          int    `json:"row"`
	Seat         int    `json:"seat"`
}
