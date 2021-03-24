import random
import string


def get_random_string(length: int) -> str:
    """
    With combination of lower and upper case
    """
    return ''.join(random.choice(string.ascii_letters) for i in range(length))
