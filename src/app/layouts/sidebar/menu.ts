import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'Dashboard',
        link: 'menu/biDashboard',
        icon: 'ph-gauge',

    },

    {
        id: 9,
        label: 'Finance',
        icon: 'ph-calendar',
        link: 'menu/role',
        parentId: 8,
    },
    {
        id: 10,
        label: 'HR Master',
        icon: 'ph-chats',
        link: 'menu/role',
        parentId: 8
    },
    {
        id: 12,
        label: 'Operation',
        icon: 'ph-storefront',
        parentId: 8,
        subItems: [
            {
                id: 13,
                label: 'Performance',
                link: 'menu/kpi',
                parentId: 12
            },
            {
                id: 13,
                label: 'KPI',
                link: 'menu/kpi',
                parentId: 12
            },
            {
                id: 13,
                label: 'QMS',
                link: 'menu/role',
                parentId: 12
            }
        ]
    },
    {
        id: 23,
        label: 'Technology Master',
        icon: 'ph-folder-open',
        link: 'apps/file-manager',
        parentId: 8,
    },
    {
        id: 23,
        label: 'IT Overview',
        icon: 'ph-folder-open',
        link: 'apps/file-manager',
        parentId: 8,
    },
    {
        id: 23,
        label: 'Sales',
        icon: 'ph-folder-open',
        link: 'apps/file-manager',
        parentId: 8,
    },
    {
        id: 24,
        label: 'Settings',
        icon: 'ph-graduation-cap',
        parentId: 8,
        subItems: [
            {
                id: 25,
                label: 'KPI Config',
                link: 'menu/kpiConfig',
                parentId: 24,
            },
            {
                id: 31,
                label: 'User Management',
                link: 'menu/user',
                parentId: 24,

            },
            {
                id: 31,
                label: 'Role Management',
                link: 'menu/coming-soon',
                parentId: 24,

            },
            {
                id: 31,
                label: 'Publisher Management',
                link: 'menu/publisher',
                parentId: 24,

            },

        ]
    },
]