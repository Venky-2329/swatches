import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements, useRouteError } from "react-router-dom"
import BasicLayout from "./basic-layout/basic-layout"
import { ExceptionComponent } from "./common/exception-handling/exception-component"

import { ProtectionWrapper } from "./common/protect-baselayout/protection-wrapper"
import RacksForm from "./pages/masters/racks/racks-form"
import RacksGrid from "./pages/masters/racks/racks-grid"
import RacksDashboard from "./pages/dasboard/racks-dashboard"



export const AppRoutes = () => {

    const router = createHashRouter(createRoutesFromElements(
        <Route errorElement={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />}>
            <Route path='/' key='/' element={
                <ProtectionWrapper>
                    <BasicLayout />
                </ProtectionWrapper>
            }  >
                <Route path="/racks-form" key="racks-form" element={<RacksForm />} />
                <Route path="/racks-grid" key="racks-grid" element={<RacksGrid />} />
                <Route path="/dashboard" key="dashboard" element={<RacksDashboard />} />

                <Route path='/403' key='/403' element={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />} />
            </Route>
            {/* <Route path="/login" key="/login" element={<Login />} /> */}

        </Route>
    ))
    return (
        <RouterProvider router={router} />
    )
}