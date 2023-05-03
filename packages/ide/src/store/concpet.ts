import { create } from 'zustand'

export default create((set) => ({
    visible: false,
    data: {
        name: '',
        description:'',
        properties: []
    },
    setData: (data: any) => set(() => ({ data })),
    showData: (data: any) => set(() => {
        return { data, visible: true }
    }),
    show: () => set({ visible: true }),
    hide: () => set({ visible: false }),
    clear: () => set({ visible: false, data: {} }),
}))