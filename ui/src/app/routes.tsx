import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements, useRouteError } from "react-router-dom";
import BasicLayout from "./basic-layout/basic-layout";
import { ExceptionComponent } from "./common/exception-handling/exception-component";
import { ProtectionWrapper } from "./common/protect-baselayout/protection-wrapper";
import BrandsGrid from "./pages/sample/brands-master/brands-grid";
import BrandsForm from "./pages/sample/brands-master/brands-form";
import SampleUpload from "./pages/sample/sample-upload/sample-upload";
import Login from "./pages/sample/login/login";
import SampleCards from "./pages/sample/sample-upload/sample-card";

export const AppRoutes = () => {
    const router = createHashRouter(createRoutesFromElements(
        <Route errorElement={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />}>
            <Route path='/' key='/' element={
                <ProtectionWrapper>
                    <BasicLayout />
                </ProtectionWrapper>
            }  >
                <Route path="/brands-grid" key="brands-grid" element={<BrandsGrid />} />
                <Route path="/brands-form" key="brands-form" element={<BrandsForm />} />
                <Route path="/sample-upload" key="sample-upload" element={<SampleUpload />} />
                <Route path="/sample-cards" key="sample-cards" element={<SampleCards />} />

                <Route path='/403' key='/403' element={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />} />
            </Route>
            <Route path="/login" key="/login" element={<Login />} />

        </Route>
    ))
    return (
        <RouterProvider router={router} />
    )
}