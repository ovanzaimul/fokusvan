import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSettings, type Settings } from "./SettingsContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface SettingsForm {
  onSuccess: () => void;
  onCancel: () => void;
}

const schema = z.object({
  focusMinutes: z.number().positive("Focus minutes must be at least 1"),
  restMinutes: z.number().positive("Rest minutes must be at least 1"),
  recoveryMinutes: z.number().positive("recovery minutes must be at least 1"),
  cycleLength: z.number().positive("Cycle must be at least 1"),
});

export default function SettingsForm({ onSuccess, onCancel }: SettingsForm) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { settings, saveSettings } = useSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Settings>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...settings,
    },
  });
  async function onSubmit(data: Settings) {
    const { focusMinutes, restMinutes, recoveryMinutes, cycleLength } = data;
    try {
      setLoading(true);
      await saveSettings({
        focusMinutes: focusMinutes,
        restMinutes: restMinutes,
        recoveryMinutes: recoveryMinutes,
        cycleLength,
      });
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Timer</FieldLegend>
          <Field>
            <FieldLabel htmlFor="focus">Focus Minutes</FieldLabel>
            <Input
              id="focus"
              type="number"
              min={1}
              {...register("focusMinutes", { valueAsNumber: true })}
            />
            {errors.focusMinutes && (
              <p className="text-red-300">{errors.focusMinutes.message}</p>
            )}
          </Field>
          <FieldGroup>
            <div className="flex gap-2">
              <Field>
                <FieldLabel>Rest</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  {...register("restMinutes", { valueAsNumber: true })}
                />
                {errors.restMinutes && (
                  <p className="text-red-300">{errors.restMinutes.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel>Recovery</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  {...register("recoveryMinutes", { valueAsNumber: true })}
                />
                {errors.recoveryMinutes && (
                  <p className="text-red-300">
                    {errors.recoveryMinutes.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>
          <Field>
            <FieldLabel>Cycles before recovery</FieldLabel>
            <Input
              type="number"
              min={1}
              {...register("cycleLength", { valueAsNumber: true })}
            />
            {errors.cycleLength && (
              <p className="text-red-300">{errors.cycleLength.message}</p>
            )}
          </Field>
        </FieldSet>

        <Field orientation="horizontal" className="flex-wrap">
          <Button type="submit">{loading ? <Spinner /> : "Save"}</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <p className="text-red-300 basis-full">{error}</p>
        </Field>
      </FieldGroup>
    </form>
  );
}
