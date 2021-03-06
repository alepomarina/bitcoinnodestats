

from nodedata.models import create_data_record

from django_cron import CronJobBase, Schedule


class UpdateNodeData(CronJobBase):
    schedule = Schedule(run_every_mins=1)
    code = 'nodedata.create_node_data'    # a unique code

    def do(self):
        create_data_record()
