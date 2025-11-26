"use client";

import { DropzoneInput } from "@/components/form/dropzone";
import { EmployeeSelect } from "@/components/form/employee-select";
import SubmitError from "@/components/form/erros";
import { Input } from "@/components/form/input";
import Select from "@/components/form/select";
import { TextArea } from "@/components/form/textarea";
import { useData } from "@/hooks/useData";
import useForm from "@/hooks/useForm";
import { Construction } from "@/interfaces/construction";
import { Employee } from "@/interfaces/employee";
import { ConstructionTask } from "@/interfaces/task";
import endPoints from "@/services/endpoints";
import { Field, FieldArray, Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Plus, Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as Yup from "yup";

interface TaskValue {
  task_id: string;
  progress: number;
  notes: string;
  images: File[];
  show_client?: boolean;
}

interface AssignmentValue {
  person: string; // employee_id
  points: string;
  notes: string;
  tasks: string[]; // construction_task_ids
}

interface FormValues {
  date: string;
  notes: string;
  images: File[];
  tasks: TaskValue[];
  assignments: AssignmentValue[];
  show_client?: boolean;
}

interface Option {
  value: string;
  label: string;
}

interface TaskOption {
  value: string;
  label: string;
  data: ConstructionTask;
}

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();

  if (!slug || Array.isArray(slug)) {
    throw new Error("Slug inválido");
  }

  const { data: construction } = useData<Construction>(endPoints.constructions.getOne(slug as string), `construction-${slug}`, { enabled: !!slug });
  const { data: employees } = useData<Employee[]>(endPoints.employees.get, "employees");
  const { handleSubmit, sending, success, error, errorMessage } = useForm(endPoints.loads.create);

  useEffect(() => {
    if (success) {
      toast.success("Tarea creada exitosamente");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
    if (error) {
      toast.error("Ha ocurrido un error");
    }
    // eslint-disable-next-line
  }, [success, error]);

  const taskOptions: TaskOption[] = useMemo(() => {
    return (construction?.tasks || []).map((t) => ({
      value: t.id.toString(),
      label: `${t.code} - ${t.category} - ${t.task}`,
      data: t,
    }));
  }, [construction]);

  const employeeOptions: Option[] = useMemo(() => {
    return (
      employees?.map((emp) => ({
        value: emp.id.toString(),
        label: `${emp.lastname}${emp.lastname && emp.name ? ", " : ""}${emp.name}`.trim(),
      })) || []
    );
  }, [employees]);

  // --- índice rápido para empleados ---
  const employeeMap = useMemo(() => {
    return (
      employees?.reduce((acc, emp) => {
        acc[emp.id.toString()] = emp;
        return acc;
      }, {} as Record<string, Employee>) || {}
    );
  }, [employees]);

  return (
    <section className="w-full py-24">
      <div className="container max-w-[900px]">
        <h3 className="font-black text-3xl text-center">Registro de Tareas</h3>
        <h4 className="font-normal mb-8 text-base text-center opacity-60">Desarrollo: {construction?.title}</h4>

        <Formik<FormValues>
          initialValues={{
            date: "",
            notes: "",
            images: [],
            tasks: [{ task_id: "", progress: 0, images: [], notes: "", show_client: false }],
            assignments: [],
            show_client: false,
          }}
          validationSchema={Yup.object({
            date: Yup.string().required("Selecciona una fecha"),
            tasks: Yup.array().of(
              Yup.object().shape({
                task_id: Yup.string().required("Selecciona una tarea"),
                progress: Yup.number().required("Campo requerido"),
              })
            ),
            assignments: Yup.array().of(
              Yup.object().shape({
                person: Yup.string().required("Selecciona una persona"),
                points: Yup.number().required("Ingresa los puntos").min(0.5, "Debe ser mayor a 0"),
                tasks: Yup.array().min(1, "Selecciona al menos una tarea"),
              })
            ),
          })}
          onSubmit={async (values) => {
            const formData = new FormData();
            formData.append("date", values.date);
            formData.append("notes", values.notes || "");
            formData.append("construction_id", `${construction?.id}`);
            formData.append("show_client", values.show_client ? "1" : "0");

            // imágenes generales
            values.images.forEach((file: File, index: number) => {
              formData.append(`images[${index}]`, file);
            });

            // tareas
            values.tasks.forEach((task, i) => {
              formData.append(`tasks[${i}][construction_task_id]`, Number(task.task_id).toString());
              formData.append(`tasks[${i}][progress]`, task.progress.toString());
              formData.append(`tasks[${i}][notes]`, task.notes || "");
              formData.append(`tasks[${i}][show_client]`, task.show_client ? "1" : "0");

              task.images.forEach((file: File, j: number) => {
                formData.append(`tasks[${i}][images][${j}]`, file);
              });
            });

            let k = 0;
            values.assignments.forEach((a) => {
              const dividedPoints = Number(a.points) / a.tasks.length;
              a.tasks.forEach((taskId) => {
                formData.append(`assignments[${k}][construction_task_id]`, Number(taskId).toString());
                formData.append(`assignments[${k}][employee_id]`, Number(a.person).toString());
                formData.append(`assignments[${k}][points]`, dividedPoints.toString());
                formData.append(`assignments[${k}][notes]`, a.notes || "");
                k++;
              });
            });

            await handleSubmit(formData);
          }}
        >
          {({ values, isValid }) => (
            <Form className="flex flex-col gap-6">
              {/* Fecha */}
              <Input label="Fecha" name="date" type="date" />

              {/* === TAREAS === */}
              <h3 className="font-semibold mt-4">Tareas</h3>
              <FieldArray name="tasks">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-4">
                    {values.tasks.map((task, index) => {
                      const selectedTask = taskOptions.find((o) => o.value === values.tasks[index].task_id)?.data;

                      return (
                        <div key={index} className="border border-slate-400 p-4 rounded-lg space-y-2">
                          <h3>Tarea {index + 1}</h3>

                          <Select name={`tasks[${index}].task_id`} label="" options={taskOptions} />

                          {selectedTask && (
                            <div className="text-sm text-gray-600 p-2 flex items-center gap-4 flex-wrap">
                              <p>
                                <strong>INC.%:</strong> {selectedTask.inc_percent}
                              </p>
                              <p>
                                <strong>INC. m2:</strong> {selectedTask.inc_m2}
                              </p>
                              <p>
                                <strong>Total S/ Computo:</strong> {selectedTask.total_without_computation}
                              </p>
                              <p>
                                <strong>Unidad:</strong> {selectedTask.unit}
                              </p>
                            </div>
                          )}

                          <Input name={`tasks[${index}].progress`} type="number" label="Progreso de la tarea %" />
                          <TextArea name={`tasks[${index}].notes`} label="Notas" />
                          <DropzoneInput
                            name={`tasks[${index}].images`}
                            label="Imágenes"
                            multiple
                            acceptedFormats={{
                              "image/jpeg": [],
                              "image/png": [],
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <Field type="checkbox" name={`tasks[${index}].show_client`} />
                            <label htmlFor={`tasks[${index}].show_client`} className="text-sm">
                              Mostrar imágenes al cliente
                            </label>
                          </div>

                          <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 pt-4 w-full">
                            <Trash2 size={14} />
                            Eliminar tarea
                          </button>
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          task_id: "",
                          images: [],
                          progress: 0,
                          notes: "",
                          show_client: false,
                        })
                      }
                      className="btn btn-outline-primary btn-sm justify-center"
                    >
                      <Plus /> Agregar tarea
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* === PERSONAS === */}
              <h3 className="font-semibold mt-4">Personas</h3>
              <FieldArray name="assignments">
                {({ form }) => {
                  return (
                    <div className="flex flex-col gap-4">
                      <EmployeeSelect
                        label="Seleccionar empleados"
                        options={employeeOptions}
                        value={employeeOptions.filter((opt) => values.assignments.some((a) => a.person === opt.value))}
                        onChange={(selected) => {
                          const newAssignments: AssignmentValue[] = selected.map((opt) => {
                            const existing = values.assignments.find((a) => a.person === opt.value);
                            return (
                              existing || {
                                person: opt.value,
                                points: "",
                                notes: "",
                                tasks: [],
                              }
                            );
                          });
                          form.setFieldValue("assignments", newAssignments);
                        }}
                      />

                      {/* Renderizamos los seleccionados */}
                      {values.assignments.map((assignment, index) => {
                        const selectedEmployee = employeeMap[assignment.person];

                        return (
                          <div key={assignment.person} className="border p-4 rounded-lg space-y-2">
                            <div className="text-sm text-gray-600 p-2 flex items-center gap-4 flex-wrap">
                              {selectedEmployee && (
                                <div className="text-sm text-gray-600 flex items-center gap-4 flex-wrap">
                                  <p>
                                    <strong>Nombre:</strong> {selectedEmployee.name} {selectedEmployee.lastname}
                                  </p>
                                  {selectedEmployee.category && (
                                    <p>
                                      <strong>Categoría:</strong> {selectedEmployee.category}
                                    </p>
                                  )}
                                  {selectedEmployee.file_data && (
                                    <p>
                                      <strong>Legajo:</strong> {selectedEmployee.file_data}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <Input name={`assignments[${index}].points`} type="number" label="Puntos" />
                            <TextArea name={`assignments[${index}].notes`} label="Notas" />

                            <h3>Indique las tareas en las que participó:</h3>
                            {values.tasks.map((t, taskIndex) => {
                              const selectedTask = construction?.tasks?.find((ct) => ct.id.toString() === t.task_id);
                              const optionLabel = `${selectedTask?.code} - ${selectedTask?.category} - ${selectedTask?.task}` || `Tarea ${taskIndex + 1}`;

                              if (!selectedTask) return null;

                              return (
                                <label key={taskIndex} className="flex items-center gap-2 text-sm">
                                  <Field type="checkbox" name={`assignments[${index}].tasks`} value={t.task_id} />
                                  <span className="line-clamp-1">{optionLabel}</span>
                                </label>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              </FieldArray>

              <h3 className="font-semibold mt-4">Datos adicionales</h3>
              <TextArea name="notes" label="Notas" />
              <DropzoneInput name="images" label="Imágenes adicionales" multiple acceptedFormats={{ "image/jpeg": [], "image/png": [] }} />
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="show_client" />
                <label htmlFor="show_client" className="text-sm">
                  Mostrar imágenes al cliente
                </label>
              </div>

              <SubmitError errorMessage={errorMessage} />

              {/* Submit */}
              <div className="flex justify-center mt-4 sticky bottom-4">
                <button disabled={sending || !isValid} type="submit" className="btn btn-gradient relative disabled:pointer-events-none disabled:opacity-50 disabled:backdrop-blur-md  z-[9999]">
                  {sending && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ClipLoader color="white" size={16} />
                    </div>
                  )}

                  <span className={`${sending ? "opacity-0" : "opacity-100"} transition-all`}> Registrar Tarea</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
