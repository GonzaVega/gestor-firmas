Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      post 'auth/google', to: 'auth#google'
      resources :users, only: [:index, :update] do
        collection do
          get 'me'
        end
      end
      resources :firma_solicitudes, only: [:index, :create, :update]
      resources :roles, only: [:index]
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
