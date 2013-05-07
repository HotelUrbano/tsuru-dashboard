from django.template.response import TemplateResponse
from django.conf import settings
from django.http import HttpResponseRedirect

from auth.views import LoginRequiredView

from pluct import resource

import requests
import json


class ListService(LoginRequiredView):
    def get(self, request):
        token = request.session.get('tsuru_token').replace('type ', '')
        auth = {
            'type': 'type',
            'credentials': token,
        }
        url = "{0}/services".format(settings.TSURU_HOST)
        services = resource.get(url, auth).data
        return TemplateResponse(request, "services/list.html",
                                {'services': services})


class ServiceDetail(LoginRequiredView):
    def get(self, request, *args, **kwargs):
        service_name = kwargs["service_name"]
        return TemplateResponse(request, "services/detail.html",
                                {'service': {"name": service_name}})


class ServiceAdd(LoginRequiredView):
    def post(self, request, *args, **kwargs):
        service_name = kwargs["service_name"]
        authorization = {'authorization': request.session.get('tsuru_token')}
        tsuru_url = '{0}/services/instances'.format(settings.TSURU_HOST)
        data = {"name": request.POST["name"],
                "service_name": service_name}
        requests.post(tsuru_url,
                      data=json.dumps(data),
                      headers=authorization)
        return HttpResponseRedirect("/")

    def get(self, request, *args, **kwargs):
        service_name = kwargs["service_name"]
        return TemplateResponse(request, "services/add.html",
                                {'service': {"name": service_name}})


class Bind(LoginRequiredView):
    def post(self, request, *args, **kwargs):
        app_name = kwargs["app_name"]
        service_name = kwargs["service_name"]
        authorization = {'authorization': request.session.get('tsuru_token')}
        tsuru_url = '{0}/services/instances/{1}/{2}'.format(
            settings.TSURU_HOST, service_name, app_name)
        requests.put(tsuru_url, headers=authorization)
        return HttpResponseRedirect("/")


class Unbind(LoginRequiredView):
    def post(self, request, *args, **kwargs):
        app_name = kwargs["app_name"]
        service_name = kwargs["service_name"]
        authorization = {'authorization': request.session.get('tsuru_token')}
        tsuru_url = '{0}/services/instances/{1}/{2}'.format(
            settings.TSURU_HOST, service_name, app_name)
        requests.delete(tsuru_url, headers=authorization)
        return HttpResponseRedirect("/")


class ServiceRemove(LoginRequiredView):
    def post(self, request, *args, **kwargs):
        service_name = kwargs["service_name"]
        authorization = {'authorization': request.session.get('tsuru_token')}
        tsuru_url = '{0}/services/c/instances/{1}'.format(
            settings.TSURU_HOST, service_name)
        requests.delete(tsuru_url,
                        headers=authorization)
        return HttpResponseRedirect("/")
