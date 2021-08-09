import { EntityModel } from '../../../core/services/abstract-rest/abstract-rest.service';
import { FormGroup } from '@angular/forms';


export class CatalystMainMasters extends EntityModel {
    designationName: string;
    familyId: string;
    typeId: string;
    aliaSSId: any;
    shapeId: string;
    sizeId: string;
    stateId: string;
    analyticalStatus: string;
    scaleId: string;
    catalystLeader: string;
    vibratedBedDensityMeasurement: number;
    scale: string;
    pieceDensityMeasurement: number;
    loi500Measurement: number;
    referenceCatalystIndicator: boolean;
    regenaratedCatalystIndicator: boolean;
    groundIndicator: boolean;
    analyticalApprovalIndicator: boolean;
    bulkLocationIndicator: boolean;
    apparentBedDensityMeasurement: number;
    activeIndicator: string;
    technologyCode: string;
    commercialFamilyName: string;
    catalystTypeName: string;
    limsSampleId: string[];
    voidFraction: any;
    technologyId: any;
    description: string;
    catalystAliasName: string;
    catalystShapeName: string;
    catalystSizeCode: string;
    catalystScaleName: string;
    catalystStateName: string;
    programFamilyName: string;
    itemType: string;
    sk: string;
    data: string;
    userId: string;
    toString(): string {
        throw new Error('Method not implemented.');
    }
}

export class CatalystMainMastersDTO {
    catalystTypeName: string;
    catalystMasterForm: FormGroup;
    catalystListfamily: any;
    catalystLeader: any;
    cols: any[];
    catalystscale: any = [];
    numberOfRecords: number;
    nOfRecordPage: any;
    totalRecords: number;
    catalystfamilynumberOfRecords: number;
    commercialFamilyName: string;
    catalystmainmaster: any;
    catalystmainmasterDetail: any = [];
    aliaslist = new Array();
    flag: boolean;
    catalystShape: any;
    catalystSize: any;
    stateslist = new Array();
    catalystFamily: any;
    leaderEID: any;
    leaderName: any;
    leadModal: any;
    formValid: boolean;
    uomFlag: boolean;
    limsSampleIdArray: any[];
    sampleIdStyle: boolean;
    IdToDelete: any;
    skToDelete: any;
    technology: any;
    privilege: boolean;
    isReset: any = 'reset';
    leadId: any;
    isDisabled:boolean;
  userName: any;
}
export class FlyoutCatalystFamilyDTO {
    catalystFamilyForm: FormGroup;
    catalystListfamilyDetail: [];
    familycols: any[];
    catalystfamilytotalRecords: number;
    catalystfamilynOfRecordPage: any;
}
export class FlyoutCatalystLeaderDTO {
    teamLeadForm: FormGroup;
    catalystLeaderDetail: any;
    leadercols: any[];
    catalystLeadernOfRecordPage: any;
    catalystLeadertotalRecords: number;
}
