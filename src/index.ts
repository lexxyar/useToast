import {reactive, UnwrapNestedRefs, UnwrapRef} from "vue";
import IUseToast from "./lib/IUseToast";
import ToastStruct from "./lib/ToastStruct";
import IToastStructParams from "./lib/IToastStructParams";

const refFlash: UnwrapNestedRefs<IUseToast> = reactive({
    items: [] as ToastStruct[],

    add: (toast: ToastStruct | IToastStructParams): string => {
        let tst: ToastStruct = (toast instanceof ToastStruct) ? toast : new ToastStruct(toast);
        refFlash.items.unshift(tst)
        return tst.id
    },
    error: (message: string): string => {
        return refFlash.add({message, type: 'danger'})
    },
    info: (message: string): string => {
        return refFlash.add({message, type: 'info'})
    },
    success: (message: string): string => {
        return refFlash.add({message, type: 'success'})
    },
    warning: (message: string): string => {
        return refFlash.add({message, type: 'warning'})
    },
    remove: (id: string): void => {
        const index: number = refFlash.items.findIndex((e: UnwrapRef<ToastStruct>): boolean => e.id === id)
        if (index >= 0) {
            refFlash.items.splice(index, 1)
        }
    },
    dismiss: (id: string): void => {
        refFlash.remove(id)
    }
})

export const useToast = () => refFlash
