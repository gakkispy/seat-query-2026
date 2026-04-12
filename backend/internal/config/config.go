package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv         string
	Host           string
	Port           string
	DatabaseURL    string
	AllowedOrigins []string
	ReadTimeout    time.Duration
	WriteTimeout   time.Duration
}

func Load() (Config, error) {
	_ = godotenv.Load()

	readTimeout, err := durationFromEnv("READ_TIMEOUT", 5*time.Second)
	if err != nil {
		return Config{}, err
	}

	writeTimeout, err := durationFromEnv("WRITE_TIMEOUT", 10*time.Second)
	if err != nil {
		return Config{}, err
	}

	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	return Config{
		AppEnv:         envOrDefault("APP_ENV", "development"),
		Host:           envOrDefault("APP_HOST", "0.0.0.0"),
		Port:           envOrDefault("APP_PORT", "8080"),
		DatabaseURL:    databaseURL,
		AllowedOrigins: csvEnvOrDefault("ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		ReadTimeout:    readTimeout,
		WriteTimeout:   writeTimeout,
	}, nil
}

func (c Config) Address() string {
	return fmt.Sprintf("%s:%s", c.Host, c.Port)
}

func envOrDefault(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	return value
}

func csvEnvOrDefault(key string, fallback []string) []string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	rawItems := strings.Split(value, ",")
	items := make([]string, 0, len(rawItems))
	for _, item := range rawItems {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			items = append(items, trimmed)
		}
	}

	if len(items) == 0 {
		return fallback
	}

	return items
}

func durationFromEnv(key string, fallback time.Duration) (time.Duration, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback, nil
	}

	parsed, err := time.ParseDuration(value)
	if err != nil {
		return 0, fmt.Errorf("invalid %s: %w", key, err)
	}

	return parsed, nil
}
