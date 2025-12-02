import { ArtifactToggleButton } from '@/components/ArtifactToggleButton';
import { resetConversation } from '@/store/chatSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsStreaming } from '@/store/selectors';

export function Header() {
	const dispatch = useAppDispatch();
	const isStreaming = useAppSelector(selectIsStreaming);

	return (
		<header className='sticky top-0 z-10 flex items-center justify-between border-b border-[#1b1f2b] bg-[#070b13]/90 px-3 py-4 backdrop-blur'>
			<div>
				<p className='text-[10px] uppercase tracking-[0.5em] text-[#d9b449]'>
					Gemini 2.5
				</p>
				<h1 className='text-lg font-semibold text-white'>
					Claude-style Coding Agent
				</h1>
			</div>
			<div className='flex items-center gap-3'>
				<ArtifactToggleButton />
				<button
					type='button'
					onClick={() => dispatch(resetConversation())}
					disabled={isStreaming}
					className='rounded-lg border border-[#f4d35e]/40 bg-[#f4d35e]/10 px-4 py-2 text-sm font-medium text-[#f4d35e] transition hover:bg-[#f4d35e]/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40'
				>
					New Chat
				</button>
			</div>
		</header>
	);
}
