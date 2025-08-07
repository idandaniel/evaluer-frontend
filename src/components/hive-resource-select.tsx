import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HiveResource } from "@/types/api";
import type { UseQueryResult } from "@tanstack/react-query";

interface HiveResourceSelectProps {
    query: UseQueryResult<Array<HiveResource>, Error>;
    disabled?: boolean;
    placeholder: string;
    label: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

export const HiveResourceSelect = ({
    query,
    disabled = false,
    placeholder,
    label,
    value,
    onValueChange
}: HiveResourceSelectProps) => {
    const { data, isLoading, isError, error } = query;
    const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="space-y-2 w-full">
            <Label htmlFor={selectId} className="text-sm font-medium">
                {label}
            </Label>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={isLoading || disabled}
            >
                <SelectTrigger id={selectId} className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {isError ? (
                        <SelectItem value="error" disabled>
                            Error: {error.message || "Failed to load options"}
                        </SelectItem>
                    ) : data?.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                        </SelectItem>
                    ))}
                    {data?.length === 0 && (
                        <SelectItem value="empty" disabled>
                            No options available
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};
