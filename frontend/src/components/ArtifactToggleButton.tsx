import { setSidebarOpen } from '@/store/chatSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentArtifact, selectSidebarOpen } from '@/store/selectors';

export function ArtifactToggleButton() {
	const dispatch = useAppDispatch();
	const currentArtifact = useAppSelector(selectCurrentArtifact);
	const sidebarOpen = useAppSelector(selectSidebarOpen);

	if (!currentArtifact) {
		return null;
	}

	return (
		<button
			type='button'
			onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
			className='rounded-lg border border-[#f4d35e]/30 bg-[#f4d35e]/10 px-4 py-2 text-sm font-medium text-[#f4d35e] transition hover:bg-[#f4d35e]/20'
		>
			{sidebarOpen ? 'Hide' : 'View'} Artifact
		</button>
	);
}
