import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements, useRouteError } from "react-router-dom"
import BasicLayout from "./basic-layout/basic-layout"
import { ExceptionComponent } from "./common/exception-handling/exception-component"

import { ProtectionWrapper } from "./common/protect-baselayout/protection-wrapper"
import RacksForm from "./pages/masters/racks/racks-form"
import RacksGrid from "./pages/masters/racks/racks-grid"
import RackCard from "./pages/warehouse-dashboard/rack-card"
import MainRackCard from "./pages/warehouse-dashboard/main-rack"
import RacksDashboard from "./pages/dasboard/racks-dashboard"
import CutSummary from "./pages/components/cut-summary"
import AllocateRacks from "./pages/components/allocate-racks"
import TrimCard from "./pages/pdf-reader/trim-card"
import TrimCardForm from "./pages/pdf-reader/trim-card-form"
import TrimCardDoc from "./pages/components/trim-card/trim-card-doc"
import TrimCardExcelDoc from "./pages/pdf-reader/trim-card-excel"

export const AppRoutes = () => {

    const router = createHashRouter(createRoutesFromElements(
        <Route errorElement={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />}>
            <Route path='/' key='/' element={
                // <ProtectionWrapper>
                    <BasicLayout />
                // </ProtectionWrapper>
            }  >
                <Route path="/trim-card" key="trim-card" element={<TrimCard />} />
                <Route path="/trim-card-form" key="trim-card-form" element={<TrimCardForm />} />
                <Route path="/trim-card-doc" key="trim-card-doc" element={<TrimCardDoc />} />

                <Route path='/403' key='/403' element={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />} />
            </Route>
            {/* <Route path="/login" key="/login" element={<Login />} /> */}

        </Route>
    ))
    return (
        <RouterProvider router={router} />
    )
}