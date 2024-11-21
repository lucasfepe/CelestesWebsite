import ProgressBar from 'react-bootstrap/ProgressBar';
import './progress.css';
export const LoadingProgress = ({ progress, displayProgress }) => (
    <div className="bg">
        <div className="w-75 progressbar">
            <div className="progress_bar_border" />
            <ProgressBar className="bg-success-1" variant="success" animated now={progress * 100} />
            <div className="progress-bar-text">
                {Math.round(displayProgress * 100) + '%'}
            </div>
        </div>
    </div>
);
