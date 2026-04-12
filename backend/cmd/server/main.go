package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"

	"seat-query/backend/internal/config"
	"seat-query/backend/internal/database"
	"seat-query/backend/internal/handlers"
	"seat-query/backend/internal/repository"
	"seat-query/backend/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	db, err := database.Open(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("connect database: %v", err)
	}
	defer db.Close()

	attendeeRepo := repository.NewAttendeeRepository(db)
	seatHandler := handlers.NewSeatHandler(attendeeRepo)
	router := server.NewRouter(cfg, seatHandler)

	httpServer := &http.Server{
		Addr:         cfg.Address(),
		Handler:      router,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()

		shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.WriteTimeout)
		defer cancel()

		if err := httpServer.Shutdown(shutdownCtx); err != nil {
			log.Printf("server shutdown error: %v", err)
		}
	}()

	log.Printf("seat-query backend listening on %s", cfg.Address())
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("serve http: %v", err)
	}
}
