import normalize from "normalize-path"
import { ActionsUnion, IGatsbyPage, IGatsbyState } from "../types"

export const pagesReducer = (
  state: IGatsbyState["pages"] = new Map<string, IGatsbyPage>(),
  action: ActionsUnion
): IGatsbyState["pages"] => {
  switch (action.type) {
    case `DELETE_CACHE`:
      return new Map()

    case `CREATE_PAGE`: {
      action.payload.component = normalize(action.payload.component)

      // throws an error if the page is not created by a plugin
      if (!action.plugin?.name) {
        console.log(``)
        console.error(JSON.stringify(action, null, 4))
        console.log(``)

        throw new Error(
          `Pages can only be created by plugins. There wasn't a plugin set when creating this page.`
        )
      }

      // Link page to its plugin.
      action.payload.pluginCreator___NODE = action.plugin.id ?? ``
      action.payload.pluginCreatorId = action.plugin.id ?? ``

      // Add page to the state with the path as key
      state.set(action.payload.path, action.payload)

      return state
    }

    case `DELETE_PAGE`: {
      state.delete(action.payload.path)

      return state
    }
    // case `CREATE_MODULE_DEPENDENCY`: {
    //   const page = state.get(action.payload.path)

    //   // probably want to mutate array moduleDependencies and not recreate
    //   state.set(action.payload.path, {
    //     ...page,
    //     moduleDependencies: [
    //       ...page.moduleDependencies,
    //       action.payload.moduleID,
    //     ],
    //   })

    //   return state
    // }
    // case `DELETE_COMPONENTS_DEPENDENCIES`: {
    //   const { paths } = action.payload

    //   paths.forEach(path => {
    //     const page = state.get(path)
    //     if (page) {
    //       state.set(path, {
    //         ...page,
    //         moduleDependencies: [],
    //       })
    //     }
    //   })

    //   return state
    // }

    default:
      return state
  }
}
