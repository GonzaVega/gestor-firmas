# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_06_212637) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "expedientes", force: :cascade do |t|
    t.string "numero"
    t.string "descripcion"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "firma_solicituds", force: :cascade do |t|
    t.integer "solicitante_id", null: false
    t.integer "firmante_id", null: false
    t.integer "expediente_id", null: false
    t.json "documentos", null: false
    t.text "comentario"
    t.integer "estado", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expediente_id"], name: "index_firma_solicituds_on_expediente_id"
    t.index ["firmante_id"], name: "index_firma_solicituds_on_firmante_id"
    t.index ["solicitante_id"], name: "index_firma_solicituds_on_solicitante_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "nombre"
    t.string "rol"
    t.string "provider"
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "firma_solicituds", "expedientes"
  add_foreign_key "firma_solicituds", "users", column: "firmante_id"
  add_foreign_key "firma_solicituds", "users", column: "solicitante_id"
end
