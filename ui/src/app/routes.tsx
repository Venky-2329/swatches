import { Route, RouterProvider, createBrowserRouter, createHashRouter, createRoutesFromElements, useRouteError } from "react-router-dom";
import BasicLayout from "./basic-layout/basic-layout";
import { ExceptionComponent } from "./common/exception-handling/exception-component";
import { ProtectionWrapper } from "./common/protect-baselayout/protection-wrapper";
import BrandsGrid from "./pages/sample/brands-master/brands-grid";
import BrandsForm from "./pages/sample/brands-master/brands-form";
import SampleUpload from "./pages/sample/sample-upload/sample-upload";
import Login from "./pages/sample/login/login";
import SampleCards from "./pages/sample/sample-upload/sample-card";
import CategoryForm from "./pages/sample/category/category-form";
import CategoryGrid from "./pages/sample/category/category-grid";
import LocationGrid from "./pages/sample/location/location-grid";
import LocationForm from "./pages/sample/location/location-form";
import SeasonGrid from "./pages/sample/season/season-grid";
import SeasonForm from "./pages/sample/season/season-form";
import UserGrid from "./pages/sample/users/user-grid";
import UserForm from "./pages/sample/users/user-form";
import ScannedCard from "./pages/sample/sample-upload/scanned-card";
import DigitalSamplesView from "./pages/sample/sample-upload/multiple-qr-view";

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
                <Route path="/sample-view" key="sample-view" element={<DigitalSamplesView />} />
                <Route path="/category-grid" key="category-grid" element={<CategoryGrid />} />
                <Route path="/category-form" key="category-form" element={<CategoryForm />} />
                <Route path="/location-grid" key="location-grid" element={<LocationGrid />} />
                <Route path="/location-form" key="location-form" element={<LocationForm />} />
                <Route path="/season-grid" key="season-grid" element={<SeasonGrid />} />
                <Route path="/season-form" key="season-form" element={<SeasonForm />} />
                <Route path="/user-grid" key="user-grid" element={<UserGrid />} />
                <Route path="/user-form" key="user-form" element={<UserForm />} />

                <Route path='/403' key='/403' element={<ExceptionComponent statusCode={403} statusMessage='Sorry, you are not authorized to access this page.' />} />
            </Route>
            <Route path="/login" key="/login" element={<Login />} />
            <Route path="/sample-digital-card" key="/sample-digital-card/:id" element={<ScannedCard />} />

        </Route>
    ))
    return (
        <RouterProvider router={router} />
    )
}