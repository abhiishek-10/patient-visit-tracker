import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    sublabel?: string;
}

interface Props {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder = 'Search…', required }: Props) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.value === value);

    const filtered = query.trim()
        ? options.filter(
            (o) =>
                o.label.toLowerCase().includes(query.toLowerCase()) ||
                o.sublabel?.toLowerCase().includes(query.toLowerCase())
        )
        : options;

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setOpen(false);
        setQuery('');
    };

    const handleOpen = () => {
        setOpen(true);
        setQuery('');
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setQuery('');
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Hidden native input for required validation */}
            <input
                tabIndex={-1}
                required={required}
                value={value}
                onChange={() => { }}
                className="absolute inset-0 w-full opacity-0 pointer-events-none"
                aria-hidden
            />

            {/* Trigger */}
            <button
                type="button"
                onClick={handleOpen}
                className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between gap-2"
            >
                {selected ? (
                    <span className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium text-gray-900">{selected.label}</span>
                        {selected.sublabel && (
                            <span className="text-xs text-gray-400 shrink-0">{selected.sublabel}</span>
                        )}
                    </span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
                <span className="flex items-center gap-1 shrink-0">
                    {value && (
                        <span
                            onClick={handleClear}
                            className="text-gray-300 hover:text-gray-500 cursor-pointer"
                            aria-label="Clear"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type to search…"
                                className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <ul className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-6 text-center text-sm text-gray-400">No results found</li>
                        ) : (
                            filtered.map((o) => (
                                <li
                                    key={o.value}
                                    onClick={() => handleSelect(o.value)}
                                    className={`px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2 hover:bg-blue-50 transition-colors ${o.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-800'
                                        }`}
                                >
                                    <span className="text-sm font-medium truncate">{o.label}</span>
                                    {o.sublabel && (
                                        <span className={`text-xs shrink-0 ${o.value === value ? 'text-blue-500' : 'text-gray-400'}`}>
                                            {o.sublabel}
                                        </span>
                                    )}
                                    {o.value === value && (
                                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
