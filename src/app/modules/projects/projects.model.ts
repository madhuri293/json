import { EntityModel } from '../../core/services/abstract-rest/abstract-rest.service';
import { Technology } from '../manage/privilege/priviege.model';
import { User } from '../manage/user/user.model';
import { FormGroup, FormArray } from '@angular/forms';
import { CapabilityModel } from './capability/capability.model';

export class Gates extends EntityModel {

    gateCode: string;
    gateDate: Date;
    projectId: string;
    itemType: string;
    sk: string;
    data: string;
    technologyCode: string;
    status: string;
    constructor(gateCode) {
        super();
        this.gateCode = gateCode;
    }
}
export class Project extends EntityModel {
    sk: string;
    projectName: string;
    projectApplicationId: string;
    businessGroupId: string;
    businessJustifyId: string;
    businessObjectionId: string;
    projectType: ProjectType;
    code: any;
    dwProjectId: string;
    projectGates: any = [];
    projectDocuments: any = [];
    casPercent: number;
    description: string;
    currentPhaseNameId: string;
    currentPhasePriorityId: string;
    projectTypeId: string;
    ppPriorityId: string;
    ptePercent: number;
    sfdc: string;
    projectStatusId: string;
    technicalLeadId: string;
    technology: Technology;
    technologyId: string;
    uopNetworkNum1: string;
    uopNetworkNum2: string;
    uopNetworkNum3: string;
    uopSegmentId: string;
    technicleTeamLeadId: string;
    gate2: Gates = new Gates('Gate 2');
    gate3: Gates = new Gates('Gate 3');
    gate4: Gates = new Gates('Gate 4');
    gate5: Gates = new Gates('Gate 5');
    gate6: Gates = new Gates('Gate 6');
}

export class Files extends EntityModel {
    contentType: string;
    data: string;
    fileDescription: string;
    fileId: string;
    fileName: string;
    fileSize: string;
    fileBytes: string;
    projectId: string;
    fileType: string;
    projectTypeId: string;
    fileStream: string;
    projectName: string;
    projectTypeName: string;
    id: string;
    itemType: string;
    sk: string;
    technologyCode: string;
    status: string;

}



export class Application extends EntityModel {

}
export class BusinessGroup extends EntityModel {

}
export class BusinessJustify extends EntityModel {

}
export class BusinessObjection extends EntityModel {

}
export class ProjectType extends EntityModel {
    projectTypeName: string;
}
export class CurrentPhasePriority extends EntityModel {
    currentPhasePriorityName: string;

}

export class TechnicleTeamLead extends EntityModel {

}

export class UopSegment extends EntityModel {
    uopSegmentName: string;
}

export class CurrentPhaseName extends EntityModel {
    currentPhaseName: string;
}
export class PpPriority extends EntityModel {
    ppPriorityName: string;

}
export class Status extends EntityModel {
    projectStatusName: string;
}

export class FileUpload extends EntityModel {
    size: number;
    type: string;
    content: string;
}

export class ProjectsDTO {
    loading = false;
    leadId: string;
    projectData: any = [];
    cols: any[];
    projectsList: any = [];
    numberOfRecords: number;
    project: Project = new Project();
    nOfRecordPage: number;
    totalrecords: number;
    projectForm: FormGroup;
    currentPhaseList: any;
    currentPhaseNameList: any;
    currentPhasePriority: any;
    statusList: any;
    uopSegment: any;
    files: FormArray;
    subErrorMsg: string;
    fileSize = 0;
    allFileSize = [];
    totalFileSize = [];
    casList = [{ id: 75, value: 75 }, { id: 50, value: 50 }, { id: 80, value: 80 }];
    petList = [{ id: 75, value: 25 }, { id: 50, value: 50 }, { id: 20, value: 20 }];
    fileUploadForm: FormGroup;
    fileSizeErrorMessage = '';
    disableSave = false;
    fileContent = new Array();
    fileTypeArray = new Array();
    fileNameArray: Files[] = [];
    totalRecords: any;
    technologyData: any = [];
    projectFilesArray: any = [];
    filesObj: Files = new Files();
    fileArray: any = [];
    size: any;
    name: string;
    date: Date = new Date();
    settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: false,
        disableSince: new Date()
    };
    myDatePickerOptions: any;
    maxDate: Date;
    projectRecord: any;
    buisnessJustificationList: any;
    buisnessObjective: any;
    buisnessGroup: any;
    technologyList: any;
    applicationList: any;
    flag: boolean;
    technicalLead: any;
    ppPriority: any;
    status: any;
    capabilityForm: FormGroup;
    teamLeadForm: FormGroup;
    projectList: any[];
    data: any[];
    uploadfile: any;
    nOfRecords: number;
    uopSegmentOptions = [];
    ppPriorityOption = [];
    currentPhase = [];
    capabilitystatus = [];
    projectDetail: any[];
    priorityselect: string;
    fileDescription = new Array();
    projectId: any;
    nametechnicalLeadId: string;
    privilege: boolean;
    isDisabled: boolean;
    customTable: any;
   selectedLeadName: string;
}

export class TechnicalLeadFlyoutDTO {
    flyoutList: any;
    flyOutTotalRecords: number;
    user: User = new User();
    flyOutForm: FormGroup;
    fluOutnOfRecordPage: number;
    flyOutPopUp: boolean;
    technicalTeamLeadList: any;
    flyOutcols: any[];
    teamLeadForm: FormGroup;
    teamLeadList: any;
    nOfRecords: any;
    loadFlyoutTable: boolean;
    columnList: any;
    capability = new CapabilityModel();
    technicalnOfRecordPage = 10;
    technicleTeam: any[];
    technicalcols: any = [];
    technicalTeamDetail: any[];
    technicaltotalRecords: number;
}






