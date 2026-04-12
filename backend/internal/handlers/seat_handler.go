package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"seat-query/backend/internal/repository"
)

type SeatHandler struct {
	repository *repository.AttendeeRepository
}

func NewSeatHandler(repo *repository.AttendeeRepository) *SeatHandler {
	return &SeatHandler{repository: repo}
}

func (h *SeatHandler) GetSeats(c *gin.Context) {
	name := strings.TrimSpace(c.Query("name"))
	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query parameter 'name' is required"})
		return
	}

	attendees, err := h.repository.SearchByName(c.Request.Context(), name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query attendees"})
		return
	}

	c.JSON(http.StatusOK, attendees)
}
