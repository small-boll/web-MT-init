import {
    base_model
} from "@/model/base_model";
import { commonNetwork } from "@/network/common/commonNetwork";


export class commonService {

    public async uploadUrl(model: FormData) {
        let params = model;
        console.log("params=======uploadUrl===========》", params);
        let startDateTime = new Date().getTime();
        const data: any = await new commonNetwork().uploadUrl(params);
        console.log("[][][][][][]DATA", data);
        let endDateTime = new Date().getTime();
        let result = <base_model>data;
        result.metadata = data.data;
        result.code = data.code;
        result.message = data.message;
        result.expendTime = endDateTime - startDateTime;
        console.log("[][][][][]result", result);
        return result;
    }


}