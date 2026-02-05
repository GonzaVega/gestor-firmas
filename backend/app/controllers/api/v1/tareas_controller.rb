class Api::V1::TareasController < ApplicationController
  include Authenticable

  def index
    tareas = Task.left_joins(:task_assignments)
                 .where('tasks.created_by_id = :uid OR task_assignments.user_id = :uid', uid: current_user.id)
                 .distinct
                 .includes(:creator, :assigned_users)
                 .order(created_at: :desc)

    render json: tareas.map { |t|
      assigned_names = t.assigned_users.pluck(:nombre).join(', ')
      assigned_ids = t.assigned_users.pluck(:id)
      
      t.as_json.merge({
        solicitante_id: t.created_by_id,
        asignado_a: assigned_ids.first, # Front compat: single ID if possible
        asignado_a_nombre: assigned_names,
        asignado_por_nombre: t.creator.nombre
      })
    }
  end

  def create
    tarea = Task.new(task_params)
    tarea.creator = current_user
    tarea.estado ||= 'pendiente'

    if tarea.save
       if params[:asignado_a]
         user_ids = Array(params[:asignado_a]) 
         user_ids.each do |uid|
            TaskAssignment.create(task: tarea, user_id: uid)
         end
       end
       render json: tarea, status: :created
    else
       render json: { errors: tarea.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # Security: Ensure user is creator or assigned
    tarea = Task.left_joins(:task_assignments)
                .where('tasks.created_by_id = :uid OR task_assignments.user_id = :uid', uid: current_user.id)
                .distinct
                .find(params[:id])

    if tarea.update(task_params)
      render json: tarea
    else
      render json: { errors: tarea.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Not found or unauthorized' }, status: :not_found
  end

  private

  def task_params
    params.permit(:expediente, :descripcion, :fecha_limite, :estado)
  end
end
