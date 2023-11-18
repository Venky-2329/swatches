import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export const ProtectionWrapper = ({ children }: { children: JSX.Element }) => {
    let location = useLocation();


    const createUser: any = localStorage.getItem('USER_ID')
    if (!createUser) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
