import { FormlyFieldConfig } from "@ngx-formly/core";

export const expression_properties: FormlyFieldConfig = {
    id:'expressionProperties',
    name:'Expression properties example',
    fieldGroup: [
        {
            key: 'text',
            type: 'input',
            props: {
                label: 'Text',
                placeholder: 'Type here to see the other field become enabled...',
            },
        },
        {
            key: 'text2',
            type: 'input',
            props: {
                label: 'Hey!',
                placeholder: 'This one is disabled if there is no text in the other input',
            },
            expressionProperties: {
                'props.disabled': '!field.parent.form.value?.text',
            },
        },
    ]
}

export const stepper:FormlyFieldConfig = {
  type: 'stepper',
  id:'stepper',
  name:'Stepper wizard',
  fieldGroup: [
    {
      key:'general',
      fieldGroup: [
        {
          key: 'creation_date',
          props: {
            disabled:false
          },
          hooks: {},
          modelOptions: {},
          validation: {
              messages: {}
          },
          resetOnHide: true,
          wrappers: [],
          expressions: {},
          expressionProperties: {}
        },
        {
          key: 'last_update',
          props: {
            disabled:false
          },
          validation: {
            messages: {}
          },
          wrappers: [],

        },
        {
          key: 'sent_date',
          props: {
            disabled:false
          },
          validation: {
            messages: {}
          },
          wrappers: [],

        },
      ],
    },
    {
      props: { label: 'Select service' },
      key:'service_selection',
      fieldGroup: [
        {
          key: 'service_code',
          type: 'simple-select',
          modelOptions: {},
          validation: {
              messages: {}
          },
          wrappers: [],
          props: {
            label:'service',
            required: true,
            options: [
              { value: 'moving', label: 'Moving' },
              { value: 'porterage', label: 'Porterage' },
              { value: 'deposit', label: 'Wharehouse' },
            ],
          }
        },
        {
          key:'more_four_sites',
          type:'checkbox',
          props:{
            defaultValue: false,
            binary:true,
            label: 'Moving more than 4 offices?'
          }
        }
      ],
    },
    {
      props: { label: 'Addresses' },
      key: 'site_selection',
      fieldGroup: [
        {
          key: 'from_site_code',
          type: 'input',
          validation: {
            messages: {}
          },
          props: {
            label: 'Address From',
            required: true,
          },
        },
        {
          key: 'to_site_code',
          type: 'input',
          validation: {
            messages: {}
          },
          props: {
            label: 'Address To',
            required: true,
          },
          expressionProperties:{
            "props.disabled":"field.parent.parent.form.value?.service_selection.service_code=='deposit'"
          }
        },
        {
          key:'possible_date',
          type:'input',
          validation: {
            messages: {}
          },
          props:{
            type:'date',
            required:true,
            label:'Estimated Date'
          }
        }
      ],
    },
    {
      key:'object_selection',
      props:{
        label: 'Select forniture',
        required:true
      },

      type: 'object-select',
      validation: {
        messages: {}
      },
      fieldArray:{
        fieldGroup:[
          {
            key: "object_tag",
            type: "input",
            props:{
              label:'Tag',
            },
            expressions:{
              'props.disabled': 'formState.externalUser',
            }
          },
          {
            key: "object_type",
            type: "input"
          },
          {
              key: "object_n",
              type: "input",
              props:{
                type:'number',
                required:true,
              }
          }
        ]
      }
    }
  ],
};
