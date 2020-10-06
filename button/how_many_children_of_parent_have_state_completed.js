/*
Contacts (App):
    - Customer (Type) (with field named 'Orders')
Customer orders (App):
    - Order (Type) (with field 'Customer')

I click a button on an Order and want to see how many of Customer's Orders are completed.
*/

const fibery = context.getService('fibery');
for (const entity of args.currentEntities) {

    // "4 of 10"
    const xOfYDone = await getAmountDone(entity);
}

async function getAmountDone(entity) {
    let e = await getEntityById({
        workspace: "workspace",
        token: "aaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbb",
        fromApp: "Contacts",
        entityName: "Customer",
        collectionName: "Orders",
        collectionAppName: "Customer orders",
        entityId: entity.Kunde.Id
    });

    e = e["user/Orders"];

    /*
        Would be better to use a field of a single state
        instead of using its name. States are types and
        can fields like any other types, but oh well.
    */

    // Remove archived or awaiting payment
    e = e.filter(n => n["workflow/state"]["enum/name"] !== "Archived" && n["workflow/state"]["enum/name"] !== "Awaiting payment");

    // Count completed
    let nDone = e.reduce((ac, cr) => {
        if (cr["workflow/state"]["enum/name"]  === "✔ Complete") return ac+1;
        return ac;
    }, 0);

    return `${nDone} of ${e.length}`;
}

async function getEntityById({
    workspace,
    token,
    fromApp,
    entityName,
    collectionName,
    collectionAppName,
    entityId
} = {}) {
    const r = await context.getService('http').postAsync(`https://${workspace}.fibery.io/api/commands`, {
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json"
        },

        body: [{
            "command": "fibery.entity/query",
            "args": {
                "query": {
                    "q/from": `${fromApp}/${entityName}`,
                    "q/select": [
                        {
                            [`user/${collectionName}`]: {
                                "q/select": [
                                    `${collectionAppName}/name`,
                                    { "workflow/state": ["enum/name"] }
                                ],
                                "q/limit": "q/no-limit"
                            }
                        }
                    ],
                    "q/where": ["=", "fibery/id", "$id"],
                    "q/limit": "q/no-limit"
                },
                "params": {
                    "$id": entityId
                }
            }
        }]
    });

    return JSON.parse(r)[0].result[0];
}