import GContactSore from 'core/stores/google-contacts';
import GContactActions from 'core/actions/google-contact';

export const SAP_GROUP_NAME = 'SAP Anywhere';

export const getSAPGroupId = () => {
    return new Promise((resolve, reject) => {
        GContactSore.getGroupsByName(SAP_GROUP_NAME).then(groups => {
            var group = groups[0];
            if (!group) {
                GContactActions.CreateGroup(SAP_GROUP_NAME)
                    .then(group => {
                        resolve(group.id['$t'])
                    }, reject)
            } else {
                resolve(group.id['$t']);
            }
        })
        
    })
}