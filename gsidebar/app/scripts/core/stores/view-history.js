export default {
	views: [],
	push(view, params) {
		this.views.push({view: view, params: params});
	}
}