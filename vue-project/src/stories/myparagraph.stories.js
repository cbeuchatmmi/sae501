import MyParagraph from '../components/elements/MyParagraph.vue'

export default {
    title: 'Elements/MyParagraph',
    component: MyParagraph,
    argTypes: {
        p: {
            control: "text",
        },
        content: {
            control: "text",

        },


    },
}
export const Title = {
    render: (args) => {
        return {
            components: {
                MyParagraph,
            },
            setup() {
                return { args }
            },
            template: `<MyParagraph v-bind="args"/>`
        }
    },
    args: {

    }
}