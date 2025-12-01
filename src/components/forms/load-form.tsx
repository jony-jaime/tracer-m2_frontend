"use client";

import { useEffect, useMemo } from "react";

import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";

import { DropzoneInput } from "@/components/form/dropzone";
import { EmployeeSelect } from "@/components/form/employee-select";
import SubmitError from "@/components/form/erros";
import { Input } from "@/components/form/input";
import Select from "@/components/form/select";
import { TextArea } from "@/components/form/textarea";

import { Plus, Trash2 } from "react-feather";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import { Construction } from "@/interfaces/construction";
import { Employee } from "@/interfaces/employee";
import { Load } from "@/interfaces/load";
import { ConstructionTask } from "@/interfaces/task";

import useForm from "@/hooks/useForm";
import endPoints from "@/services/endpoints";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface TaskValue {
    task_id: string;
    progress: number;
    notes: string;
    images: File[];
    show_client?: boolean;
}

interface AssignmentValue {
    person: string;
    points: string;
    notes: string;
    tasks: string[];
}

interface FormValues {
    date: string;
    notes: string;
    images: File[];
    tasks: TaskValue[];
    assignments: AssignmentValue[];
    show_client?: boolean;
}

interface TaskOption {
    value: string;
    label: string;
    data: ConstructionTask;
}

interface Option {
    value: string;
    label: string;
}

export default function LoadForm({
    load,
    construction,
    employees,
    onClose,
}: {
    load?: Load;
    construction: Construction;
    employees: Employee[];
    onClose: () => void;
}) {
    const { handleSubmit, sending, success, error, errorMessage } = useForm(
        load ? endPoints.loads.update(construction.id, load.id) : endPoints.loads.create,
        load ? "update" : "create"
    );
    const params = useParams();
    const queryClient = useQueryClient();

    // Convertir load → valores iniciales
    const initialValues: FormValues = useMemo(() => {
        if (!load) {
            return {
                date: "",
                notes: "",
                images: [],
                tasks: [
                    { task_id: "", progress: 0, images: [], notes: "", show_client: false },
                ],
                assignments: [],
                show_client: false,
            };
        }

        return {
            date: load.date || "",
            notes: load.notes || "",
            images: [], // no pre-cargamos archivos
            show_client: !!load.show_client,
            tasks:
                load.tasks?.map((t) => ({
                    task_id: t.construction_task_id.toString(),
                    progress: Number(t.progress || 0),
                    notes: t.notes || "",
                    images: [], // no pre-cargamos
                    show_client: !!t.show_client,
                })) ?? [],
            assignments:
                load.employee_hours?.reduce<AssignmentValue[]>((acc, eh) => {
                    const existing = acc.find((a) => a.person === eh.employee_id.toString());

                    if (existing) {
                        existing.tasks.push(eh.construction_task_id.toString());
                        existing.points = (Number(existing.points) + Number(eh.points || 0)).toString();
                    } else {
                        acc.push({
                            person: eh.employee_id.toString(),
                            points: eh.points || "0",
                            notes: eh.notes || "",
                            tasks: [eh.construction_task_id.toString()],
                        });
                    }

                    return acc;
                }, []) ?? [],
        };
    }, [load]);

    // Task options
    const taskOptions: TaskOption[] = useMemo(() => {
        return (construction?.tasks || []).map((t) => ({
            value: t.id.toString(),
            label: `${t.code} - ${t.category} - ${t.task}`,
            data: t,
        }));
    }, [construction]);

    // Employee options
    const employeeOptions: Option[] = useMemo(() => {
        return (
            employees?.map((emp) => ({
                value: emp.id.toString(),
                label: `${emp.lastname}${emp.lastname && emp.name ? ", " : ""}${emp.name}`.trim(),
            })) || []
        );
    }, [employees]);

    // Index by id
    const employeeMap = useMemo(() => {
        return (
            employees?.reduce((acc, emp) => {
                acc[emp.id.toString()] = emp;
                return acc;
            }, {} as Record<string, Employee>) || {}
        );
    }, [employees]);

    // Éxito / error
    useEffect(() => {
        if (success) {
            toast.success(load ? "Carga actualizada" : "Carga creada");

            queryClient.invalidateQueries({
                queryKey: [`construction-${params.slug}-loads`],
            });

            onClose();
        }
        if (error) {
            toast.error("Ha ocurrido un error");
        }
    }, [success, error]);

    return (
        <div className="py-6">
            <Formik<FormValues>
                enableReinitialize
                initialValues={initialValues}
                validationSchema={Yup.object({
                    date: Yup.string().required("Selecciona una fecha"),
                    tasks: Yup.array().of(
                        Yup.object().shape({
                            task_id: Yup.string().required("Selecciona una tarea"),
                            progress: Yup.number().required("Campo requerido"),
                        })
                    ),
                })}
                onSubmit={async (values) => {
                    const formData = new FormData();
                    formData.append("date", values.date);
                    formData.append("notes", values.notes || "");
                    formData.append("construction_id", `${construction?.id}`);
                    formData.append("show_client", values.show_client ? "1" : "0");

                    values.images.forEach((file: File, index: number) => {
                        formData.append(`images[${index}]`, file);
                    });

                    values.tasks.forEach((task, i) => {
                        formData.append(
                            `tasks[${i}][construction_task_id]`,
                            task.task_id
                        );
                        formData.append(`tasks[${i}][progress]`, task.progress.toString());
                        formData.append(`tasks[${i}][notes]`, task.notes || "");
                        formData.append(
                            `tasks[${i}][show_client]`,
                            task.show_client ? "1" : "0"
                        );

                        task.images.forEach((file: File, j: number) => {
                            formData.append(`tasks[${i}][images][${j}]`, file);
                        });
                    });

                    let k = 0;
                    values.assignments.forEach((a) => {
                        const dividedPoints = Number(a.points) / a.tasks.length;
                        a.tasks.forEach((taskId) => {
                            formData.append(
                                `assignments[${k}][construction_task_id]`,
                                taskId
                            );
                            formData.append(
                                `assignments[${k}][employee_id]`,
                                a.person
                            );
                            formData.append(
                                `assignments[${k}][points]`,
                                dividedPoints.toString()
                            );
                            formData.append(
                                `assignments[${k}][notes]`,
                                a.notes || ""
                            );
                            k++;
                        });
                    });

                    await handleSubmit(formData);


                }}
            >
                {({ values, isValid }) => (
                    <Form className="flex flex-col gap-6 pb-10">

                        <Input label="Fecha" name="date" type="date" />

                        {/* === TAREAS === */}
                        <h3 className="font-semibold mt-4">Tareas</h3>

                        <FieldArray name="tasks">
                            {({ push, remove }) => (
                                <div className="flex flex-col gap-4">
                                    {values.tasks.map((task, index) => {
                                        const selectedTask = taskOptions.find(
                                            (o) => o.value === values.tasks[index].task_id
                                        )?.data;

                                        return (
                                            <div
                                                key={index}
                                                className="border border-input p-4 rounded-lg space-y-2"
                                            >
                                                <h3>Tarea {index + 1}</h3>

                                                <Select
                                                    name={`tasks[${index}].task_id`}
                                                    label=""
                                                    options={taskOptions}
                                                />

                                                {selectedTask && (
                                                    <div className="text-sm text-muted-foreground p-2 flex flex-wrap gap-4">
                                                        <p><strong>INC.%:</strong> {selectedTask.inc_percent}</p>
                                                        <p><strong>INC. m2:</strong> {selectedTask.inc_m2}</p>
                                                        <p><strong>Total s/Cómputo:</strong> {selectedTask.total_without_computation}</p>
                                                        <p><strong>Unidad:</strong> {selectedTask.unit}</p>
                                                    </div>
                                                )}

                                                <Input
                                                    name={`tasks[${index}].progress`}
                                                    type="number"
                                                    label="Progreso de la tarea %"
                                                />

                                                <TextArea
                                                    name={`tasks[${index}].notes`}
                                                    label="Notas"
                                                />

                                                <DropzoneInput
                                                    name={`tasks[${index}].images`}
                                                    label="Imágenes"
                                                    multiple
                                                    acceptedFormats={{ "image/jpeg": [], "image/png": [] }}
                                                />

                                                <div className="flex items-center gap-2">
                                                    <Field
                                                        type="checkbox"
                                                        name={`tasks[${index}].show_client`}
                                                    />
                                                    <label className="text-sm">
                                                        Mostrar imágenes al cliente
                                                    </label>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 pt-4"
                                                >
                                                    <Trash2 size={14} />
                                                    Eliminar tarea
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <Button
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

                                    >
                                        <Plus /> Agregar tarea
                                    </Button>
                                </div>
                            )}
                        </FieldArray>

                        {/* === ASIGNACIONES === */}
                        <h3 className="font-semibold mt-4">Asignaciones</h3>
                        <FieldArray name="assignments">
                            {({ form }) => (
                                <div className="flex flex-col gap-4">
                                    <EmployeeSelect
                                        label="Seleccionar empleados"
                                        options={employeeOptions}
                                        value={employeeOptions.filter((opt) =>
                                            values.assignments.some((a) => a.person === opt.value)
                                        )}
                                        onChange={(selected) => {
                                            const newAssignments: AssignmentValue[] = selected.map(
                                                (opt) => {
                                                    const existing = values.assignments.find(
                                                        (a) => a.person === opt.value
                                                    );
                                                    return (
                                                        existing || {
                                                            person: opt.value,
                                                            points: "",
                                                            notes: "",
                                                            tasks: [],
                                                        }
                                                    );
                                                }
                                            );
                                            form.setFieldValue("assignments", newAssignments);
                                        }}
                                    />

                                    {values.assignments.map((a, index) => {
                                        const emp = employeeMap[a.person];

                                        return (
                                            <div
                                                key={a.person}
                                                className="border p-4 rounded-lg space-y-2"
                                            >
                                                {emp && (
                                                    <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
                                                        <p><strong>Nombre:</strong> {emp.name} {emp.lastname}</p>
                                                        {emp.category && (<p><strong>Categoria:</strong> {emp.category}</p>)}
                                                        {emp.file_data && (<p><strong>Legajo:</strong> {emp.file_data}</p>)}
                                                    </div>
                                                )}

                                                <Input
                                                    name={`assignments[${index}].points`}
                                                    type="number"
                                                    label="Puntos"
                                                />

                                                <TextArea
                                                    name={`assignments[${index}].notes`}
                                                    label="Notas"
                                                />

                                                <h3>Tareas en las que participó:</h3>

                                                {values.tasks.map((t, taskIndex) => {
                                                    const selectedTask =
                                                        construction?.tasks?.find(
                                                            (ct) =>
                                                                ct.id.toString() === t.task_id
                                                        );
                                                    const label =
                                                        selectedTask
                                                            ? `${selectedTask.code} - ${selectedTask.category} - ${selectedTask.task}`
                                                            : `Tarea ${taskIndex + 1}`;

                                                    if (!selectedTask) return null;

                                                    return (
                                                        <label
                                                            key={taskIndex}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <Field
                                                                type="checkbox"
                                                                name={`assignments[${index}].tasks`}
                                                                value={t.task_id}
                                                            />
                                                            <span className="line-clamp-1">{label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </FieldArray>

                        {/* === DATOS ADICIONALES === */}
                        <h3 className="font-semibold mt-4">Datos adicionales</h3>

                        <TextArea name="notes" label="Notas" />

                        <DropzoneInput
                            name="images"
                            label="Imágenes adicionales"
                            multiple
                            acceptedFormats={{ "image/jpeg": [], "image/png": [] }}
                        />

                        <div className="flex items-center gap-2">
                            <Field type="checkbox" name="show_client" />
                            <label htmlFor="show_client" className="text-sm">
                                Mostrar imágenes al cliente
                            </label>
                        </div>

                        <SubmitError errorMessage={errorMessage} />

                        <div className="flex justify-center sticky bottom-3">
                            <Button
                                disabled={sending || !isValid}
                                type="submit"
                                variant="add"
                                className="w-[90%]"
                            >
                                {sending && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ClipLoader color="white" size={16} />
                                    </div>
                                )}

                                <span className={`${sending ? "opacity-0" : "opacity-100"}`}>
                                    {load ? "Actualizar Carga" : "Registrar Tarea"}
                                </span>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
