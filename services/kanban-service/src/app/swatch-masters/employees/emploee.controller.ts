import { Controller } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { CommonResponseModel, CreateEmployeeDto, EmployeeRequestDto, GetAllEmployeeResponse } from 'libs/shared-models';
import { EmployeeRequest } from './dto/employee.request';
import { ReportingRequest } from './dto/reporting-manager.dto';

@Controller('employees')
@ApiTags('employees')
export class EmployeeController {
    applicationExceptionHandler: any;
    constructor(private readonly service: EmployeeService) { }

    @Post('/createEmployee')
    async createEmployee(@Body() createDto: any, isUpdate: boolean = false): Promise<any> {
        try {
            return await this.service.createEmployee(createDto, false);
        } catch (error) {
            return (error);
        }
    }

    @Post('/updateEmployee')
    async updateEmployee(@Body() createDto: any, isUpdate: boolean = false): Promise<any> {
        try {
            return await this.service.createEmployee(createDto, true);
        } catch (error) {
            return (error)
        }
    }


    // @Post('getAllEmployees')
    // async getAllEmployees(): Promise<GetAllEmployeeResponse> {
    //     try {
    //         return await this.service.getAllEmployees();

    //     } catch (error) {
    //         return (error);
    //     }
    // }

    @Get('/getAllEmployees')
    async getAllEmployees(): Promise<GetAllEmployeeResponse> {
        try {
            return await this.service.getAllEmployees();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }

    @Post('getAllEmployeesById')
    async getAllEmployeesById(@Body() req: ReportingRequest): Promise<GetAllEmployeeResponse> {
        try {
            return await this.service.getAllEmployeesById(req);
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllEmployeesByUnit')
    async getAllEmployeesByUnit(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesByUnit(req);
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllToEmployeesByUnit')
    async getAllToEmployeesByUnit(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllToEmployeesByUnit(req);
        } catch (error) {
            return (error);
        }
    }

    // @Post('getManagerByOperator')
    // async getManagerByOperator(@Body() req:EmployeeRequest): Promise<GetAllEmployeeResponse> {
    //     try {
    //         return await this.service.getManagerByOperator(req);
    //     } catch (error) {
    //         return (error);
    //     }
    // }

    @Post('/deactiveEmployee')
    async deactiveEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.deactiveEmployee(req);
        } catch (error) {
            return (error);
        }
    }

    @Post('/getAllMarketingEmployees')
    async getAllMarketingEmployees(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllMarketingEmployees();
        } catch (error) {
            return (error);
        }
    }

    @Post('/activateOrDeactivateEmployee')
    async activateOrDeactivateEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateEmployee(req);
        } catch (error) {
            console.log(error);
        }
    }

    @Get('/getAllActiveEmployees')
    async getAllActiveEmployees(): Promise<GetAllEmployeeResponse> {
        try {
            return await this.service.getAllActiveEmployees();
        } catch (err) {
            console.error('Error in controller:', err);
        }
    }


}
