import ProgressBar from 'react-bootstrap/ProgressBar';
import './progress.css';
import { useState, useEffect } from 'react';



export const LoadingProgress = ({ progress, displayProgress }) => {
    const [show, setShow] = useState();

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 15000);
    }, [])
    return (
        <div className="bg">

            <div className="w-75 progressbar">
                <div
                    className="messageFlex"
                    style={{
                        visibility: show ? 'visible' : 'hidden',
                        opacity: show ? 1 : 0
                    }}>
                    <div>First time may take a long time to download assets.</div></div>
                <div className="progress_bar_border" />
                <ProgressBar className="bg-success-1" variant="success" animated now={progress * 100} />
                <div className="progress-bar-text">
                    {Math.round(displayProgress * 100) + '%'}
                </div>
            </div>
        </div >
    )
};
