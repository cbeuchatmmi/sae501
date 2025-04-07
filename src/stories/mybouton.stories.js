import MyBouton from '../components/elements/MyBouton.vue'

export default {
    title: 'Elements/MyBouton',
    component: MyBouton,
    argTypes: {

        label: {
            control: "text"
        },
        href: {
            control: "text"
        },
    },
}

export const Button = {
    render: (args) => {
        return {
            components: {
                MyBouton,
            },
            setup() {
                return { args }
            },
            template: `<MyBouton v-bind="args"></MyBouton>`
        }
    },
    args: {
        label: "My link button",
        href: "#"

    }
}

