import { useAppSelector } from '@/store/hooks';
import { selectError, selectIsStreaming } from '@/store/selectors';

export function StreamingIndicator() {
	const isStreaming = useAppSelector(selectIsStreaming);
	const error = useAppSelector(selectError);

	if (error) {
		return (
			<div className='rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100'>
				{error}
			</div>
		);
	}

	if (!isStreaming) {
		return null;
	}

	return (
		<div className='rounded-2xl border border-[#f4d35e]/30 bg-[#f4d35e]/10 px-4 py-3 text-xs uppercase tracking-[0.4em] text-[#f4d35e]'>
			Agent is thinking...
		</div>
	);
}
