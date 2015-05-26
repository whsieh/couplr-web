import json
import sys

DEFAULT_UNCERTAINTY_THRESHOLD = 0.1
MALE_LABEL = 0
FEMALE_LABEL = 1
UNCERTAIN_LABEL = 2

def filename_with_extension(filename, extension):
    extension = "." + extension if extension[0] != "." else extension
    return filename + extension if filename[-len(extension):] != extension else filename

def load_json_as_object(filename):
    filename = filename_with_extension(filename, "json")
    jsonFile = open(filename, "r")
    dataAsString = jsonFile.read()
    jsonFile.close()
    return json.loads(dataAsString)

def ngrams_in_name(name):
    name = "^" + name + "$"
    grams = []
    for index, char in enumerate(name):
        for i in xrange(1, 4):
            if index < len(name) - i:
                grams.append(name[index:index + i + 1])
    return grams

class GenderClassifier(object):
    def __init__(self, filename):
        params = load_json_as_object(filename)
        self.maleNames = set(params["male_names"])
        self.femaleNames = set(params["female_names"])
        self.intercept = params["intercept"]
        self.coefficients = params["coefficients"]
        self.uncertaintyThreshold = params["uncertainty_threshold"]

    def _signed_distance(self, name):
        dotProduct, norm = 0, 0
        for ngram in ngrams_in_name(name):
            if ngram in self.coefficients:
                dotProduct += self.coefficients[ngram]
                norm += 1
        return (dotProduct / norm) + self.intercept if norm > 0 else 0

    def _label_from_signed_distance(self, distance):
        if abs(distance) < self.uncertaintyThreshold:
            return UNCERTAIN_LABEL
        return MALE_LABEL if distance <= 0 else FEMALE_LABEL

    def _label_from_data(self, name):
        if name in self.maleNames:
            return MALE_LABEL
        if name in self.femaleNames:
            return FEMALE_LABEL
        return UNCERTAIN_LABEL

    """
    Given a first name, returns 0, 1, or 2, indicating the gender of the
    name. 0 indicates male, 1 indicates female, and 2 indicates that the
    classifier was unable to reach any conclusion.
    """
    def gender(self, name):
        name = name.lower()
        genderFromData = self._label_from_data(name)
        if genderFromData is not UNCERTAIN_LABEL:
            return genderFromData
        return self._label_from_signed_distance(self._signed_distance(name))

if __name__ == "__main__":
    cls = GenderClassifier("bin/gender/linsvc.json")
    response = {}
    print json.dumps({ name: cls.gender(name) for name in sys.argv[1:] })

