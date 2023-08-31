import { useRef, useState } from 'react';

export const useDebounce = <T>(initValue: T, time = 300): [T, (value: T) => void] => {
	const timerRef = useRef<undefined | NodeJS.Timeout>(undefined);
	const [debouncedValue, setDebouncedValue] = useState<T>(initValue);

	const queueSetDebouncedValue = (value: T) => {
		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, time);
	};

	return [debouncedValue, queueSetDebouncedValue];
};
