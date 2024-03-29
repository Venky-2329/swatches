import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  useRouteError,
} from 'react-router-dom';
import BasicLayout from './basic-layout/basic-layout';
import { ExceptionComponent } from './common/exception-handling/exception-component';
import { ProtectionWrapper } from './common/protect-baselayout/protection-wrapper';
import BrandsGrid from './pages/sample/brands-master/brands-grid';
import BrandsForm from './pages/sample/brands-master/brands-form';
import SampleUpload from './pages/sample/sample-upload/sample-upload';
import Login from './pages/sample/login/login';
import SampleCards from './pages/sample/sample-upload/sample-card';
import CategoryForm from './pages/sample/category/category-form';
import CategoryGrid from './pages/sample/category/category-grid';
import LocationGrid from './pages/sample/location/location-grid';
import LocationForm from './pages/sample/location/location-form';
import SeasonGrid from './pages/sample/season/season-grid';
import SeasonForm from './pages/sample/season/season-form';
import UserGrid from './pages/sample/users/user-grid';
import UserForm from './pages/sample/users/user-form';
import ScannedCard from './pages/sample/sample-upload/scanned-card';
import DigitalSamplesView from './pages/sample/sample-upload/multiple-qr-view';
import SeparateView from './pages/sample/sample-upload/separate-view';
import HomeScreen from './pages/sample/sample-upload/carasoul-images';
import { BrandDto, categoryDto } from 'libs/shared-models';
import FabricSwatchUpload from './pages/swatch-masters/fabric-swatch/fabric-swatch-form';
import BuyerGrid from './pages/swatch-masters/buyer-mastrer/buyer-grid';
import BuyerForm from './pages/swatch-masters/buyer-mastrer/buyer-form';
import FabricSwatchGrid from './pages/swatch-masters/fabric-swatch/fabric-swatch-grid';
import SupplierGrid from './pages/swatch-masters/supplier-master/supplier-grid';
import SupplierForm from './pages/swatch-masters/supplier-master/supplier-form';
import TrimSwatchUpload from './pages/swatch-masters/trims/trim-form';
import EmployeeGrid from './pages/swatch-masters/employee/employee-grid';
import EmployeeForm from './pages/swatch-masters/employee/employee-form';
import FabricSwatchApproval from './pages/swatch-masters/fabric-swatch/fabric-swatch-approval';
import { TrimSwatchGrid } from './pages/swatch-masters/trims/trim-grid';
import ApprovedUserForm from './pages/swatch-masters/authorised/authorised-form';
import ApproverGrid from './pages/swatch-masters/authorised/authorised-grid';
import FabricSwatchDetailView from './pages/swatch-masters/fabric-swatch/fabric-swatch-detail-view';
import TrimSwatchApproval from './pages/swatch-masters/trims/trim-approval';
import { TrimSwatchDetailView } from './pages/swatch-masters/trims/trim-swatch-detail-view';
import TrimCards from './pages/swatch-masters/trims/trim-cards';
import FabricSwatch from './pages/swatch-masters/fabric-swatch/fabric-swatch-card';

export const AppRoutes = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route
        errorElement={
          <ExceptionComponent
            statusCode={403}
            statusMessage="Sorry, you are not authorized to access this page."
          />
        }
      >
        <Route path="/"  key="/"
          element={
            <ProtectionWrapper>
              <BasicLayout />
            </ProtectionWrapper>
          }
        >
          <Route  path="/brands-grid" key="brands-grid" element={<BrandsGrid />} />
          <Route path="/brands-form" key="brands-form" element={
              <BrandsForm
                brandData={undefined}
                updateDetails={function (brandData: BrandDto): void {
                  throw new Error('Function not implemented.');
                }}
                isUpdate={undefined}
                closeForm={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            }
          />
          <Route path="/sample-upload"  key="sample-upload" element={<SampleUpload />}  />
          <Route path="/fabric-swatch-upload"key="fabric-swatch-upload"element={<FabricSwatchUpload />}/>
          <Route path='/fabric-swatch-view' key={'fabric-swatch-view'} element={<FabricSwatchGrid/>}/>
          <Route path="/trims-swatch-upload"key="trims-swatch-upload"element={<TrimSwatchUpload />}/>
          <Route path="/trims-swatch-view"key="trims-swatch-view"element={<TrimSwatchGrid />}/>
          <Route path="/trims-swatch-approval"key="trims-swatch-approval"element={<TrimSwatchApproval />}/>
          <Route path='/trims-swatch-detail-view/:trimSwatchId' key='/trims-swatch-detail-view' element={<TrimSwatchDetailView/>}/>
          <Route path='/trim-swatch-cards' key='/trim-swatch-cards' element={<TrimCards/>}/>



          <Route  path="/sample-cards"  key="sample-cards" element={<SampleCards />}  />
          <Route  path="/sample-view"  key="sample-view" element={<DigitalSamplesView />} />
          <Route path="/category-grid" key="category-grid" element={<CategoryGrid />}  />
          <Route  path="/category-form"  key="category-form" element={
              <CategoryForm
                categoryData={undefined}
                isUpdate={false}
                closeForm={() => {}}
                updateDetails={(undefined) => {}}
              />
            }
          />
          <Route path="/location-grid" key="location-grid" element={<LocationGrid />} />
          <Route  path="/location-form" key="location-form" element={<LocationForm />}  />
          <Route  path="/season-grid"  key="season-grid" element={<SeasonGrid />} />
          <Route  path="/season-form"  key="season-form" element={ <SeasonForm
                seasonData={undefined}
                isUpdate={false}
                closeForm={() => {}}
                updateDetails={(undefined) => {}}
              />
            }
          />
          <Route path="/employee-grid" key="employee-grid" element={<EmployeeGrid />} />
          <Route path="/employee-form" key="employee-form" element={<EmployeeForm 
          employeeData={undefined}

          isUpdate={false}
          closeForm={() => { }}
          updateDetails={(undefined) => { }}
          />} />
          <Route path="/user-grid" key="user-grid" element={<UserGrid />} />
          <Route path="/user-form" key="user-form" element={<UserForm />} />

          <Route path='buyer-grid' key='buyer-grid' element={<BuyerGrid />} />
          <Route path='buyer-form' key='buyer-form' element={<BuyerForm buyerData={undefined} isUpdate={false} updateDetails={() => {undefined}}  closeForm={() => {}}/>} />
          
          <Route path='supplier-grid' key='supplier-grid' element={<SupplierGrid />} />
          <Route path='supplier-form' key='supplier-form' element={<SupplierForm supplierData={undefined} isUpdate={false} updateDetails={() => {undefined}}  closeForm={() => {}}/>} />

          <Route path='approval-grid' key='approval-grid' element={<ApproverGrid />} />
          <Route path='approval-form' key='approval-form' element={<ApprovedUserForm data={undefined} isUpdate={false} updateApprovalUser={() => {undefined}}  closeForm={() => {}}/>} />
          <Route path='/fabric-swatch-cards' key='fabric-swatch-cards' element={<FabricSwatch/>}/>

          <Route  path="/separete-card/:id"  key="separete-card"  element={<SeparateView />} />
          <Route  path="/home-screen" key="home-screen" element={<HomeScreen />} />
          <Route path='/fabric-swatch-approval' key='/fabric-swatch-approval' element={<FabricSwatchApproval/>}/>
         <Route path='/fabric-swatch-detail-view/:fabricSwatchId' key='/fabric-swatch-detail-view' element={<FabricSwatchDetailView/>}/>

          <Route
            path="/403"
            key="/403"
            element={
              <ExceptionComponent
                statusCode={403}
                statusMessage="Sorry, you are not authorized to access this page."
              />
            }
          />
        </Route>
        <Route path="/login" key="/login" element={<Login />} />
        <Route
          path="/sample-digital-card/:id"
          key="/sample-digital-card"
          element={<ScannedCard />}
        />

        
      </Route>

      

    )
  );
  return <RouterProvider router={router} />;
};
