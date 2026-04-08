import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { LocationService } from "@/services/LocationService";
import type { LocationSearchResult } from "@/types/api";

interface PlaceAutocompleteInputProps {
    label: string;
    placeholder?: string;
    value: LocationSearchResult | null;
    onSelect: (location: LocationSearchResult) => void;
    onClear?: () => void;
}

export default function PlaceAutocompleteInput({
    label,
    placeholder = "Search for a location...",
    value,
    onSelect,
    onClear,
}: PlaceAutocompleteInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (value) {
            setInputValue(value.label);
        }
    }, [value]);

    useEffect(() => {
        if (!showDropdown) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setInputValue(query);
        setHighlightedIndex(-1);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await LocationService.search(query);
                setSuggestions(results);
                setShowDropdown(true);
            } catch (error) {
                console.error("Location search failed:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSelect = (location: LocationSearchResult) => {
        onSelect(location);
        setInputValue(location.label);
        setSuggestions([]);
        setShowDropdown(false);
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        setInputValue("");
        setSuggestions([]);
        setShowDropdown(false);
        setHighlightedIndex(-1);
        onClear?.();
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || suggestions.length === 0) {
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSelect(suggestions[highlightedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setShowDropdown(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-secondary">
                {label}
            </label>
            <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50">
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-border bg-primary py-3 pl-12 pr-10 text-secondary outline-none transition focus:border-accent"
                />
                {inputValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-secondary/50 transition hover:text-danger"
                    >
                        ×
                    </button>
                )}
            </div>

            {showDropdown && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-primary py-2 shadow-xl"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.latitude}-${suggestion.longitude}`}
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition ${
                                index === highlightedIndex
                                    ? "bg-accent/10 text-accent"
                                    : "text-secondary hover:bg-accent/5"
                            }`}
                        >
                            <MapPin className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate">{suggestion.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
