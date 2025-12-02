import { ChatInput } from '@/components/ChatInput';
import { CodeSidebar } from '@/components/CodeSidebar';
import { Header } from '@/components/Header';
import { MessageList } from '@/components/MessageList';
import { StreamingIndicator } from '@/components/StreamingIndicator';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentArtifact, selectSidebarOpen } from '@/store/selectors';

function App() {
	const sidebarOpen = useAppSelector(selectSidebarOpen);
	const currentArtifact = useAppSelector(selectCurrentArtifact);

	return (
		<div className='flex min-h-screen max-h-screen overflow-hidden bg-[#05070f] text-[#f3f6ff]'>
			<div className='flex flex-1 justify-center overflow-y-auto px-4 lg:px-8'>
				<div className='flex w-full max-w-4xl flex-col '>
					<Header />
					<div className='flex flex-1 flex-col '>
						<div className='flex-1  pr-4'>
							<div className='rounded-3xl border border-[#0d1220] bg-[#060a12]'>
								<MessageList />
							</div>
							<div className='mt-4'>
								<StreamingIndicator />
							</div>
						</div>
						<ChatInput />
					</div>
				</div>
			</div>
			{sidebarOpen && currentArtifact && <CodeSidebar />}
		</div>
	);
}

export default App;
