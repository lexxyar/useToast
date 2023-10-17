import {reactive, render, UnwrapNestedRefs, UnwrapRef, VNode, h} from "vue";
import IUseToast from "./lib/IUseToast";
import ToastStruct from "./lib/ToastStruct";
import IToastStructParams from "./lib/IToastStructParams";
import {TMessageType} from "./lib/typedef";
import {Toast} from "@lexxsoft/upui";

const refFlash: UnwrapNestedRefs<IUseToast> = reactive({
    items: [] as ToastStruct[],

    add: (toast: ToastStruct | IToastStructParams): string => {
        let tst: ToastStruct = (toast instanceof ToastStruct) ? toast : new ToastStruct(toast);
        refFlash.items.unshift(tst)

        let container: HTMLElement | null = document.getElementById('toast-container')
        if (!container) {
            container = document.createElement('div')
            container.setAttribute('id', 'toast-container')
            container.setAttribute('class', 'fixed right-4 top-4 z-50 w-full max-w-xs space-y-4')
            document.body.append(container)
        }

        const tmpContainer: HTMLDivElement = document.createElement('div')
        const res: VNode<any> = h(Toast, {message: toast.message, styl: toast.type})
        render(res, tmpContainer)
        const item: HTMLElement = tmpContainer.children.item(0) as HTMLElement
        item.setAttribute('id', tst.id)
        container.append(item)

        setTimeout(() => {
            refFlash.dismiss(tst.id)
        }, 3000)

        return tst.id
    },
    error: (message: string): string => {
        console.log('error')
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
export {IUseToast, ToastStruct, IToastStructParams, TMessageType}
