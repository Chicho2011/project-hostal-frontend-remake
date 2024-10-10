
export default defineNuxtRouteMiddleware((to, from) => {
    const {isAuthenticated} = useSanctumAuth()

    if(!isAuthenticated.value) {
        abortNavigation()
        return navigateTo('/login')
    }

    if(isAuthenticated.value && to?.name == 'login') {
        return navigateTo('/dashboard')
    }

})