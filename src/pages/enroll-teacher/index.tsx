<Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-8"
  >
    <PersonalInfoSection form={form} />

    <AddressSection form={form} />

    <TeacherFields form={form} />

    <Button type="submit">
      Create Teacher
    </Button>
  </form>
</Form>