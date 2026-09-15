from stepfunctions_activity_worker import ActivityWorker


def my_task(**task_input):
    """Perform the task based on this task's input."""
    # Perform your task here! 
    return "Hello, " + task_input["who"] + "!"


if __name__ == "__main__":
    activity_arn = "arn:aws:states:us-east-1:616704459970:activity:get-greeting"
    worker = ActivityWorker(activity_arn, my_task)
    worker.listen()