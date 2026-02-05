class Task < ApplicationRecord
  belongs_to :creator, class_name: 'User', foreign_key: 'created_by_id'
  has_many :task_assignments, dependent: :destroy
  has_many :assigned_users, through: :task_assignments, source: :user

  validates :descripcion, presence: true
  validates :expediente, presence: true
  validates :estado, presence: true
end
