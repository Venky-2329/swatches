import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements, useRouteError } from "react-router-dom"
import BasicLayout from "./basic-layout/basic-layout"
import { ExceptionComponent } from "./common/exception-handling/exception-component"

import { ProtectionWrapper } from "./common/protect-baselayout/protection-wrapper"
import RacksForm from "./pages/masters/racks/racks-form"
import RacksGrid from "./pages/masters/racks/racks-grid"
import RackCard from "./pages/warehouse-dashboard/rack-card"
import MainRackCard from "./pages/warehouse-dashboard/main-rack"



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
                <Route path="/rack-card" key="rack-card" element={<MainRackCard  />} />
                <Route path='/403' key='/403' element={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />} />
            </Route>
            {/* <Route path="/login" key="/login" element={<Login />} /> */}

        </Route>
    ))
    return (
        <RouterProvider router={router} />
    )
}