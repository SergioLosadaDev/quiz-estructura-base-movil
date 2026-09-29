import { useState, type FormEvent } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import type { RegisterUser } from "../../application/use-cases/RegisterUser";

interface UserRegistrationForm {
  name: string;
  email: string;
  password: string;
}

type FormField = keyof UserRegistrationForm;

interface UserRegistrationPageProps {
  registerUser: RegisterUser;
}

const initialForm: UserRegistrationForm = {
  name: "",
  email: "",
  password: "",
};

export function UserRegistrationPage({
  registerUser,
}: UserRegistrationPageProps) {
  const [form, setForm] = useState<UserRegistrationForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: FormField,
    value: string | number | null | undefined,
  ) => {
    setForm((current) => ({ ...current, [field]: String(value ?? "") }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setMessage("");
  };

  const showFieldError = (field: FormField) =>
    fieldErrors[field] ? (
      <IonText color="danger">
        <p role="alert">{fieldErrors[field]}</p>
      </IonText>
    ) : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setMessage("");

    try {
      const result = await registerUser.execute(form);

      if (result.success) {
        setMessageType("success");
        setMessage(`Usuario ${result.data.name} registrado correctamente.`);
        setForm(initialForm);
        return;
      }

      setMessageType("error");
      setMessage(result.error.message);
      setFieldErrors(result.error.fieldErrors ?? {});
    } catch {
      setMessageType("error");
      setMessage("Ocurrió un error inesperado. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} noValidate>
          <IonList>
            <IonItem>
              <IonInput
                label="Nombre"
                labelPlacement="stacked"
                name="name"
                autocomplete="name"
                value={form.name}
                required
                onIonInput={(event) => updateField("name", event.detail.value)}
                aria-invalid={Boolean(fieldErrors.name)}
              />
            </IonItem>
            {showFieldError("name")}

            <IonItem>
              <IonInput
                label="Email"
                labelPlacement="stacked"
                name="email"
                type="email"
                autocomplete="email"
                value={form.email}
                required
                onIonInput={(event) => updateField("email", event.detail.value)}
                aria-invalid={Boolean(fieldErrors.email)}
              />
            </IonItem>
            {showFieldError("email")}

            <IonItem>
              <IonInput
                label="Contraseña"
                labelPlacement="stacked"
                name="password"
                type="password"
                autocomplete="new-password"
                value={form.password}
                required
                onIonInput={(event) =>
                  updateField("password", event.detail.value)
                }
                aria-invalid={Boolean(fieldErrors.password)}
              />
            </IonItem>
            {showFieldError("password")}
          </IonList>

          <IonButton expand="block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Registrar usuario"}
          </IonButton>

          {message && (
            <IonText color={messageType === "success" ? "success" : "danger"}>
              <p role="status">{message}</p>
            </IonText>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
}
