package providers

import (
	"context"

	"github.com/spidey/dailytechprophet/internal/models"
)

// Provider defines the interface every news source must implement.
type Provider interface {
	Name() string
	Display() string
	Fetch(ctx context.Context, category string, page, pageSize int) ([]models.Article, error)
	Enabled() bool
}

// Registry holds all registered providers.
type Registry struct {
	providers []Provider
}

func NewRegistry() *Registry {
	return &Registry{}
}

func (r *Registry) Register(p Provider) {
	r.providers = append(r.providers, p)
}

func (r *Registry) Get(name string) Provider {
	for _, p := range r.providers {
		if p.Name() == name {
			return p
		}
	}
	return nil
}

func (r *Registry) All() []Provider {
	return r.providers
}

func (r *Registry) Enabled() []Provider {
	var out []Provider
	for _, p := range r.providers {
		if p.Enabled() {
			out = append(out, p)
		}
	}
	return out
}

func (r *Registry) Info() []models.ProviderInfo {
	var out []models.ProviderInfo
	for _, p := range r.providers {
		out = append(out, models.ProviderInfo{
			Name:    p.Name(),
			Display: p.Display(),
			Enabled: p.Enabled(),
		})
	}
	return out
}
