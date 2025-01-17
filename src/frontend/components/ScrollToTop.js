import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const ScrollToTop =  ({ history }) => {
    useEffect(() => {
        const unsubscribe = history.listen(() => {
            window.scrollTo(0, 0);
        });

        return () => {
            unsubscribe();
        }
    }, [history]);

    return null;
}

export default withRouter(ScrollToTop);